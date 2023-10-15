import 'dotenv/config';
import { connect } from '@planetscale/database';
import { nanoid } from 'nanoid';

const config = {
	host: 'aws.connect.psdb.cloud',
	password: process.env.DATABASE_PASSWORD,
	username: process.env.DATABASE_USERNAME,
};

const conn = connect(config);

async function main() {
	// todo: limit invite codes
	// find users with less than 3 unused codes

	const results = await conn.execute(
		`INSERT INTO InvitationCode (ownerId, code)
    SELECT u.id, uuid()
    FROM auth_user AS u
    INNER JOIN (
        SELECT ownerId, COUNT(code) AS unused_codes
        FROM InvitationCode
        WHERE used = 0
        GROUP BY ownerId
        HAVING unused_codes < 3
    ) AS ic ON ic.ownerId = u.id
    WHERE (ic.unused_codes < 3 OR ic.unused_codes IS NULL) AND u.id IS NOT NULL;`,
	);

	console.log(results);
}

main();
