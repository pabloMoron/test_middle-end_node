import express = require("express")
const passport = require("passport")
import { UniqueTokenStrategy } from "passport-unique-token"
import { getConfig } from "../server/environment"

export interface Source {
  data_source: DATA_SOURCES
}
export enum DATA_SOURCES {
  API,
  MOCK,
}
export interface IISessionRequest extends express.Request {
  user: Source
}
const config = getConfig()

export function init() {
  passport.use(
    new UniqueTokenStrategy(
      {
        tokenHeader: "x-auth-token",
      },
      (token, done) => {
        let source: Source
        if (token === config.api_key_ml) {
          source = {
            data_source: DATA_SOURCES.API,
          }
          return done(null, source)
        }
        if (token === config.api_key_mock) {
          source = {
            data_source: DATA_SOURCES.MOCK,
          }
          return done(null, source)
        }
        const err = {
          name: "NO_VALID_TOKEN",
          message: "invalid token",
          status: 401,
        }
        return done(err)
      }
    )
  )
}
