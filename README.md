# dappbot-api-client
A JS package for client-side interaction with the DappBot API.  Provides interfaces roughly like:

```typescript
import API from '@eximchain/dappbot-api-client';
import request from 'request-promise-native';

const creds = {
  username : 'testing@example.com',
  password : 'secret-from-user'
}
const loginResponse = await request(API.auth.login.request(creds))
```

Highlights:
- Designed to work seamlessly with `react-request-hook`.
- Compatible with `axios`, `request`, and `fetch`.
- Written in Typescript & depends on our shared [`@eximchain/dappbot-types`](https://www.npmjs.com/package/@eximchain/dappbot-types) package, so if you are a Typescript user, most of the API will autocomplete for you.
- Works equally well in browsers and node.

## Usage

### Installation

```shell
npm install @eximchain/dappbot-api-client @eximchain/dappbot-types
```

### Configuration

The Dappbot client needs to be configured with:

- The API's URL
- The current authentication data
- A setter to update that authentication data

We let the consumer handle storing that data in order to be compatible with more environments.  Here is an example of how a React app would configure that at the root component:

```typescript
import React, { FunctionComponent, useState } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import User from '@eximchain/dappbot-types/spec/user';
import AppBody from './components/AppBody';

export function APIProvider(props){
  // Use the helper from our types package to get the initial auth
  // state so Typescript correctly interprets the generic type.
  const [authData, setAuthData] = useState(User.emptyAuthData());
  const API = new DappbotAPI({
    dappbotUrl : 'https://api.dapp.bot',
    authData : authData,
    setAuthData : setAuthData
  })
  return <AppBody API={API} />
}

export default APIProvider;
```

### Interacting with the API


#### Accessing the Methods

Each method is mounted within its root resource, for instance:
- Login request: `API.auth.login`
- Create dapp request: `API.private.create`

The methods then all provide different factory functions depending on which request solution you're using.  These methods synchronously return fully configured request objects, including a fully scoped path, headers with `Authorization` if necessary, and a properly formatted body.  Note that the methods do not actually perform the request, they just produce the appropriate object for the request solution you're using:

```typescript
import { useResource } from 'react-request-hook';
import request from 'request-promise-native';
import fetch from 'node-fetch';
import axios from 'axios';

const creds = {
  username : 'testing@example.com',
  password : 'secret-from-user'
}

// Using react-request-hook; this method will
// also automatically put the correct response
// types onto `resourceResponse`
const [resourceResponse, requestLogin] = useResource(API.auth.login.resource);

// Using request
const requestResponse = await request(API.auth.login.request(creds));

// Using fetch
const fetchResponse = await fetch(API.auth.login.fetch(creds));

// Using axios
const axiosResponse = await axios(API.auth.login.axios(creds));
```

#### Method Arguments

All of the factory methods have their arguments appropriately typed.  If a call has no body, then no arg object needs to be provided.  If the call's path includes a variable (e.g. dapp management calls), then the function will instead take two arguments: one for the name, one for the body:

```typescript
// Reading your Stripe payment data does not
// require any body or path arguments
const ReadPaymentReq = API.payment.read.request()
const ReadPaymentRes = await request(ReadPaymentReq);

// Reading a Dapp has a path argument but no body
const ReadDappReq = API.private.read.request('DappName')
const ReadDappRes = await request(ReadReq)

// Create has both a path arg and a body arg
const NewDappConfig = { ... };
const CreateReq = API.private.create.request('NewDappName', NewDappConfig)
const CreateRes = await request(CreateReq)
```

#### Validation

You can also use the underlying type system to validate & interpret the decoded API responses:

```typescript
import Types from '@eximchain/dappbot-types';

const CreateName = '...';
const CreateArgs = { ... }

// Methods which have bodies all provide a validator
// typeguard `isArgs()` which verifies the body shape
// at runtime.  You may not need it, as the request
// methods will warn you if your types are incorrect,
// but the typeguard is there if you do.
if (Types.Methods.Private.CreateDapp.isArgs(CreateArgs)) {

  // Casting the response tells TS that the body will
  // follow our standard API shape with `data`
  // and `err` keys.
  const CreateRes = await request(CreateReq) as Types.Methods.Private.CreateDapp.Response;

  // This is an actual runtime type guard which verifies
  // that data is non-null & err is null.
  if (Types.Response.isSuccessResponse(CreateRes)) {

    // Within this block, TS knows:
    // (1) that `CreateRes.data` is non-null, because of the guard
    // (2) the shape of that data, because of the CreateRes cast

  } else {

    // Within this block, TS knows that 
    // only `CreateRes.err` is non-null

  }
}

```


#### Maintaining Auth in Long Sessions

If you are using this library in a web application, it's important to note that the `Authorization` values returns from the login method expires after 1 hour.  If the user sits on the page for a Long Time and then tries to make a request, you need to refresh their authorization.  You could do this manually with the provided method, but the API provides a helper function which handles it for you:

```typescript
// Assuming this API object has valid auth data
// from sometime in the last month, RefreshedAPI
// is now guaranteed to send authenticated reqs.
const RefreshedAPI = await API.refreshAuth();

const DappList = await request(RefreshedAPI.private.list.request())
```

`refreshAuth()` inspects the `authData` config parameter and follows these steps:

1. If the **`RefreshToken` is empty**, then it **throws an error** asking you to log in. 
2. If there is a `RefreshToken`, check the `ExpiresAt` field to see if it's actually expired.
3. If the **token is still valid**, the method **returns the same `API` instance**.
4. If the **token is expired**, it calls `API.auth.refresh` and then uses the `setAuthData` config to update the stored `authData`.  It then **returns a new `API` instance**.

##### Declarative Caveat

The 4th step above is essential when using this library in a declarative environment like React.  If you call `refreshAuthorization()` in an async function and it updates, the original `API` object will now be out of date in the current execution.  By returning a new API object, shallow object comparisons (e.g. prop comparisons) will detect when a stale instance has been replaced by a fresh one.

Here is a heavily commented example of applying in a React component which refreshes a user's stale auth data before requesting their dapp list.  Note the use of helper methods to detect auth status:

```typescript
import React, { useEffect } from 'react';
import { useResource } from 'react-request-hook'
import APIType from '@eximchain/dappbot-api-client'

interface FetcherProps {
  API : APIType
}

export function DappListFetcher({ API }:FetcherProps) {

  // Plug the current API, which has old authData,
  // into the `useResource` value.
  const [dappList, requestDappList] = useResource(API.private.list.resource);

  // Use a helper function to check authorization before
  // actually making the request.  Have to do it this way
  // because the reqFactories must be synchronous.
  async function getList() {

    if (API.hasActiveAuth()) {
      // If this helper returns true, then the authData 
      // isn't null and isn't expired -- you can safely 
      // make the request!
      requestDappList();
    }

    if (API.hasNoAuth()) {
      // There is no stale auth to refresh, you need to
      // have the user make an `API.auth.login` call.
      goToLoginPage();
    }

    if (API.hasStaleAuth()) {
      // We now know that the authData is stale, so we
      // need to refresh it on this render.  The refresh
      // call can throw, so make sure to wrap in a try-catch
      try {
        // If we were to call `requestDappList()` during this
        // render, it would produce a request with the current 
        // API's stale auth data. Instead, we call `refreshAuth`,
        // which will trigger updating the authData and getting
        // a new API object.
        //
        // You don't need to do anything else here, the follow-on
        // request with valid auth data is triggered by the
        // effect below.  If you'd like, maybe inform your 
        // user that their session is being refreshed.
        await API.refreshAuth();
      } catch (err) {
        console.log('Error refreshing auth: ',err);
      }
    }

  }

  // This effect completes the loop to ensure that calling 
  // `API.refreshAuth()` will ensure the request happens
  // with up-to-date auth.
  useEffect(function fetchListOnStartAndAPI() {
    getList();
  }, [API])
  // By giving the fetch effect a dependency array with API
  // in it, we guarantee that we will attempt to fetch the
  // list:
  //   1. When the component first renders
  //   2. Whenever the authData updates
  // Therefore, the fetch function doesn't need to manually
  // call itself after refreshing the authData -- this effect
  // ensures it will happen automatically.

  return (
    <DappListPresentation dapps={dappList.data} />
  )
}

export default DappListFetcher;
```

## Development

This library essentially just uses wrapper functions to instrument Dappbot's underlying types in [@eximchain/dappbot-types](https://github.com/Eximchain/dappbot-types), so depending on how you are modifying this client, you may need to update those types.  They are installed via npm, but while you are developing, it's easier to install them from the file system.  Here is how you do that with npm:

```shell
~ git clone https://github.com/Eximchain/dappbot-types.git
~ git clone https://github.com/Eximchain/dappbot-api-client.git
~ cd dappbot-api-client
~ npm uninstall @eximchain/dappbot-types
~ npm install ../dappbot-types
```

Once you've done that, you'll be able to update the type source, save the file, and have those changes immediately reflected here.  If you make a PR here which depends on type changes, make sure to include a link to your PR on `@eximchain/dappbot-types` as well.