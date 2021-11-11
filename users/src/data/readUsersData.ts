import fs from 'fs';
import { UserAttrs } from '../models/user';

const users: UserAttrs[] = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

export { users };