import * as passport from "passport"
import { UniqueTokenStrategy } from "passport-unique-token"

export function init() {
    passport.use(
        new UniqueTokenStrategy({
            tokenHeader: "token"
        },(token, done) => {
            console.log(token)
            if (token === "e962f81a-4d42-4eb3-86cd-a25e7237c8dc") {
                console.log("Consultar API")
                return done(null, { api: true }, "datos de api")
            }
            if (token === "55a4639f-55e8-4e14-a6cc-b79977b20a4e") {
                console.log("Devolver datos mockeados")
                return done(null, { mock: true }, "datos mockeados")
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
