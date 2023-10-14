# 12urenloop


## Call to letmein to validate

This is a call to a LOCALSERVER on the Home Konvent server. It is used to verify the JWT token, so we know the token is from a valid user. The jwt token should be signed with the HK secret (not included in this repo). This ensures the origin of the token.

The cookie is stored as cookie by the letmein server of HK.

```
fetch('https://letmein.homekonvent.be/user/validate', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            cookie: 'JWT='+req.cookies.JWT,
        },
    })
```

> This will not work on local debug setup, unless you have a local letmein server running

> Letmein server is a server that handles all registrations and logins.
