<script lang="ts">
	import { Button } from '@margins/ui';
	import XIcon from 'lucide-svelte/icons/x';
</script>

<Button
	href="/"
	variant="outline"
	size="icon"
	class="fadeIn animation-delay-1 fixed left-8 top-8 rounded-full duration-1000"
>
	<XIcon class="text-muted-foreground h-4 w-4" />
</Button>
<div class="flex min-h-screen flex-col items-center justify-center">
	<div
		class="animate-fast-fly-in flex flex-col items-center justify-center space-y-4"
	>
		<div class="flex">
			<div class="max-w-xs px-2">
				<svg
					class="h-20 w-20"
					viewBox="0 0 500 500"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect x="4" y="4" width="492" height="492" rx="246" fill="black" />
					<path
						d="M122 134.5C122 120.141 133.641 108.5 148 108.5V108.5C162.359 108.5 174 120.141 174 134.5V391.5H122V134.5Z"
						fill="white"
					/>
					<path
						d="M224 134.5C224 120.141 235.641 108.5 250 108.5V108.5C264.359 108.5 276 120.141 276 134.5V300.01C276 305.135 276 307.698 274.987 309.649C274.133 311.293 272.793 312.633 271.149 313.487C269.198 314.5 266.635 314.5 261.51 314.5H238.49C233.365 314.5 230.802 314.5 228.851 313.487C227.207 312.633 225.867 311.293 225.013 309.649C224 307.698 224 305.135 224 300.01V134.5Z"
						fill="white"
					/>
					<path
						d="M326 134.5C326 120.141 337.641 108.5 352 108.5V108.5C366.359 108.5 378 120.141 378 134.5V391.5H326V134.5Z"
						fill="white"
					/>
				</svg>
			</div>
		</div>

		<slot />
	</div>
</div>
