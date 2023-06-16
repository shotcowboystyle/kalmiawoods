import { parse } from 'lightcookie';

export async function isAuthenticated(req) {
  let authenticated = false;
  let user = {};
  const cookie = req.headers.get('cookie');

  if (cookie) {
    const parsed = parse(cookie);
    user = {
      name: parsed.jwt.name,
      email: parsed.jwt.email,
      picture: parsed.jwt.picture,
      active: parsed.jwt.active,
      id: parsed.jwt.id,
      admin: parsed.jwt.admin,
    };

    // if(parsed.jwt) {
    //   jwt.verify(parsed.jwt, import.meta.env.JWT_SECRET, (e, decoded) => {
    //     if(!e && !!decoded) {
    //       user = {
    //         name: decoded.name,
    //         email: decoded.email,
    //         picture: decoded.picture,
    //         active: decoded.active,
    //         id: decoded.id,
    //         admin: decoded.admin
    //       }
    //       authenticated = true;
    //     }
    //   });
    // }
  }

  return {
    authenticated,
    ...user,
  };
}

// export function createHeaders({jwt, location}) {
//   headers.append('Set-Cookie', `jwt=${jwt}; Expires=${expires}; Path=/; HttpOnly; Secure;`);
//   headers.append('Location', location);

//   return headers;
// }

export const Authorization = { Authorization: `Bearer ` };
export const ContentType = { 'Content-Type': 'application/json' };
