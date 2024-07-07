import { onDestroy, tick } from "svelte"
import type { SvelteComponent, ComponentProps, ComponentType } from "svelte"
import { derived, get, writable } from "svelte/store"
import LibraryCommands from "../commands/library.commands.svelte"
import type { Command } from "@margins/features/commands"

type MenuState<T extends SvelteComponent = SvelteComponent> = {
  content: ComponentType<T>
  contentProps?: ComponentProps<T>
  placeholder?: string
  shouldFilter?: boolean
  // ...
}

function bounce(container: HTMLElement) {
  const transform = getComputedStyle(container).transform
  container.style.transform =
    transform === "none" ? "scale(0.98)" : `${transform} scale(0.98)`
  setTimeout(() => {
    container.style.transform = transform
  }, 75)
}

// TODO: consider making Promise and using asyncDerived
type ActionProvider = (filter: string, global: boolean) => Command[]

class Commander<TState> {
  private state = new Map<string, MenuState>()

  public add<TName extends string>(key: TName, menu: MenuState) {
    this.state.set(key as string, menu)
    return this as Commander<TState & { [key in TName]: MenuState }>
  }

  public get<TName extends string>(key: TName) {
    return this.state.get(key as string) as MenuState
  }

  public remove<TName extends string>(key: string) {
    this.state.delete(key)
    return this as Commander<Omit<TState, TName>>
  }
}

type ExtractMenu<T> = T extends Commander<infer U> ? U : never
type CommandState = ExtractMenu<typeof commander>
type CommandStateKey = keyof CommandState

const commander = new Commander().add("library-items", {
  content: LibraryCommands,
  placeholder: "Open item...",
  shouldFilter: false,
})

type State = {
  currentMenu: string | null
  input: string
  open: boolean
}

function main_command_state() {
  // TODO: is there a way to turn commander into effectively an enum/number comparison instead of the theoretically less efficient string comparison?
  const state = writable<State>({
    currentMenu: null,
    input: "",
    open: false,
  })

  // TODO: does this need to be a store?
  const providers = writable(new Map<string, ActionProvider>())
  const componentProviders = writable(
    new Map<
      string,
      {
        component: ComponentType
        props?: Record<string, unknown>
      }
    >(),
  )

  const registeredActions = derived(
    [providers, state],
    ([$providers, $state]) => {
      if (!$state.open) return []
      const p = [...$providers.values()].reverse()
      const actions = p.flatMap(provider => provider($state.input, true))
      return actions
    },
  )
  const registeredComponents = derived(
    [componentProviders, state],
    ([$providers, $state]) => {
      if (!$state.open) return []
      return [...$providers.values()]
    },
  )

  const { set, subscribe, update } = state

  const menuStack: string[] = []

  const currentMenu = derived(state, $state => {
    console.log("currentMenu", $state.currentMenu, commander)
    if (!$state.currentMenu) return null
    const menu = commander.get($state.currentMenu)
    if (!menu) return null
    return menu
  })

  const createPlaceholder = (placeholder: string) =>
    derived(
      [currentMenu],
      ([$currentMenu]) => $currentMenu?.placeholder ?? placeholder,
    )

  const containerEl = writable<HTMLDivElement | null>(null)

  const setMenu = <TMenuKey extends string = CommandStateKey>(
    menu: TMenuKey,
    opts: {
      bounce?: boolean
      resetInput?: boolean
    } = {
      bounce: false,
      resetInput: true,
    },
  ) => {
    menuStack.push(menu)
    if (opts.bounce === true) {
      const el = get(containerEl)
      console.log({ el })
      if (el) {
        bounce(el)
      }
    }
    update(state => ({
      ...state,
      currentMenu: menu,
      input: opts.resetInput === false ? state.input : "",
    }))
  }

  const reset = (resetOpen = false) => {
    menuStack.length = 0
    tick().then(() => {
      update(state => ({
        ...state,
        currentMenu: null,
        input: "",
        open: resetOpen === true ? false : state.open,
      }))
    })
  }

  return {
    back: () => {
      menuStack.pop()
      update(state => ({
        ...state,
        currentMenu: menuStack.at(-1) ?? null,
      }))
    },
    close: () =>
      update(state => ({ ...state, currentMenu: null, open: false })),
    containerEl,
    createPlaceholder,
    currentMenu,
    open: (menu: CommandStateKey | null = null) =>
      update(state => ({ ...state, currentMenu: menu, open: true })),
    register: (key: string, provider: ActionProvider) => {
      providers.update(providers => {
        providers.set(key, provider)
        return providers
      })
      onDestroy(() => {
        providers.update(p => {
          p.delete(key)
          return p
        })
      })
    },
    registerComponent: <TComponent extends SvelteComponent>(
      key: string,
      component: ComponentType<TComponent>,
      props?: ComponentProps<TComponent>,
    ) => {
      componentProviders.update(providers => {
        providers.set(key, {
          component,
          props,
        })
        return providers
      })
      onDestroy(() => {
        componentProviders.update(p => {
          p.delete(key)
          return p
        })
      })
    },

    /**
     * Register a menu for the command state. Gets removed on destroy. Returns a type-safe setMenu function.
     * @param key provider key
     * @param menu menu
     * @returns type-safe setMenu function
     */
    registerMenu: <TMenuKey extends string>(key: TMenuKey, menu: MenuState) => {
      const c = commander.add(key, menu)
      type NewMenuState = keyof ExtractMenu<typeof c>
      return {
        removeMenu: () => commander.remove(key),
        setMenu: setMenu<NewMenuState>,
      }
    },

    registeredActions,

    registeredComponents,

    reset,

    /**
     * Convenience function to run an action and close the command state.
     * @param fn Action to run
     * @param keepOpen Whether to keep the command state open after running the action
     */
    run: (fn: () => void, keepOpen = false) => {
      if (keepOpen !== true) reset(true)
      fn()
    },

    set,

    setMenu,
    subscribe,
    toggle: () => update(state => ({ ...state, open: !state.open })),
    update,
  }
}

export const mainCommandState = main_command_state()
