import * as passport from "passport"
import { UniqueTokenStrategy } from "passport-unique-token"

export interface Source  {
    data_source: string;
}

export function init() {
    passport.use(new UniqueTokenStrategy({
        tokenHeader: "token"
    }, (token, done) => {
        let source: Source
        console.log(token)
        if (token === "e962f81a-4d42-4eb3-86cd-a25e7237c8dc") {
            console.log("Consultar API")
            source = {
                data_source: "api"
            }
            return done(null, source)
        }
        if (token === "55a4639f-55e8-4e14-a6cc-b79977b20a4e") {
            console.log("Devolver datos mockeados")
            source = {
                data_source: "api"
            }
            return done(null, source)
        }
        const err = {
            name: "NO_VALID_TOKEN",
            message: "Token invalido",
            status: 401
        }
        return done(err)
    })
    )
}
