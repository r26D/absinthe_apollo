# Apollo-Absinthe-Upload-Link

A network interface for Apollo that enables file-uploading to Absinthe back
ends.

# This branch is for Apollo V3

## Usage

I simplified this to just be the middleware. That allows you to use other
middleware to handle the other issues related to the request.
```js
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { createUploadMiddleware } from "apollo-absinthe-upload-link";
import {ApolloLink} from "apollo-link";

const client = new ApolloClient({
  link: ApolloLink.from([createUploadMiddleware,
    createHttpLink({
      uri: "localhost:4000/graphqql",
      credentials: "include"
    })
])
});
```


### Usage with React Native

Substitute [`File`](https://developer.mozilla.org/en/docs/Web/API/File) with [`ReactNativeFile`](https://github.com/bytewitchcraft/apollo-absinthe-upload-link/blob/master/src/validators.js):

```js
import { ReactNativeFile } from 'apollo-absinthe-upload-link'

const file = new ReactNativeFile({
  uri: '…',
  type: 'image/jpeg',
  name: 'photo.jpg'
})

const files = ReactNativeFile.list([
  {
    uri: '…',
    type: 'image/jpeg',
    name: 'photo-1.jpg'
  },
  {
    uri: '…',
    type: 'image/jpeg',
    name: 'photo-2.jpg'
  }
])
```

## License

MIT (see LICENSE)

## Acknowledgements

* @labtwentyfive's [`apollo-absinthe-upload-client`](https://github.com/labtwentyfive/apollo-absinthe-upload-client)
* @jaydenseric [`apollo-upload-client`](https://github.com/jaydenseric/apollo-upload-client)
