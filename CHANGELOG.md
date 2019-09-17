# v1.1.0
Upgraded `requestBuilder`'s `reqFactory` methods to include a fifth key, `call()`.  While the previous four keys just return the configuration objects for various request libraries, the new `call()` function uses `request-promise-native` to actually perform the request and return `Promise<Response>`.  This is ideal for small apps which are mostly just consuming DappBot data.

# v1.0.1
Fixed a number of runtime bugs which appeared when plugging this library into our web client.
- Per-root api classes were trying to call `this.builder` before its value had been assigned in the constructor.  Now all of their bodies just declare typed properties, while the actual assignment happens in the constructor.
- Upgraded `@eximchain/dappbot-types` to a new version where all typeguards are free of runtime errors.
- Made the refresh methods stop throwing errors when there's no auth to refresh, as users can now simply check `API.hasStaleAuth()` to see if they can perform a refresh.
- Ensured that if `this.authData.Authorization !== ''`, then all requests will include it in their headers, rather than just requests to specific paths.
- Fixed URL generation by leveraging the WHATWG URL API; now we don't need to string munge the `dappbotUrl` against each `path` to make sure all the `/`s add up right.