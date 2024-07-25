'use strict'

import { Sequelize } from 'sequelize'
import process from 'process'
const env = process.env.NODE_ENV || 'development'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(__dirname + '/../config/database.js')[env]

let sequelize: Sequelize

if (config.use_env_variable) {
  sequelize = new Sequelize(config.use_env_variable, config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

export default sequelize
