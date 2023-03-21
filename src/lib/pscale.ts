import { DATABASE_PASSWORD, DATABASE_USERNAME } from "$env/static/private"
import { connect } from "@planetscale/database"
import {Kysely} from 'kysely'
import {PlanetScaleDialect} from 'kysely-planetscale'
import type { DB } from "./prisma/kysely/types"

const config = {
    host: 'aws.connect.psdb.cloud',
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD
  }
// export const conn = connect(config)

export const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect(config),
});
