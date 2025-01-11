import { expressjwt as jwt } from "express-jwt";
import { Auth0Audience, Auth0Domain } from "../config/config";

const authMiddleware = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${Auth0Domain}/.well-known/jwks.json`,
  }),
  audience: Auth0Audience,
  issuer: `https://${Auth0Domain}/`,
  algorithms: ["RS256"],
});

export default authMiddleware;
