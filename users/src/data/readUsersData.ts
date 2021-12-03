import fs from 'fs';
import { UserType } from '../types';

const users: UserType[] = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

export { users };