import { ApolloLink } from '@apollo/client';
import { print } from 'graphql/language/printer'
import extractFiles from './extractFiles'
import { isObject } from './validators'


export const createUploadMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({fetchOptions: {formData: null}})
  if (typeof FormData !== 'undefined' && isObject(operation.variables)) {
    const { variables, files } = extractFiles(operation.variables)
  
    if (files.length > 0) {
     
      const formData = new FormData()
    //  formData.append('operationName', operation.operationName)
      formData.append('query', print(operation.query))
      formData.append('variables', JSON.stringify(variables))
      files.forEach(({name, file}) => {
         
        formData.append(name, {
          uri: decodeURI(file.uri),
          //type: "application/pdf",
          type: file.type,
          name: file.name
        })
      })
    // console.log("FormData", formData)
      operation.setContext({fetchOptions: {formData}})
    }

  }
 
  return forward(operation)
})

export const customFetcher = (chosenURI, options) => {

   if (options.formData) {
     console.log("Swapping the body")
     options.body = options.formData;
     delete options.headers["content-type"];
     options.formData = null;
     console.log("**********************************************")
     console.log("Final Body", options.body)
    // console.log("Headers", options.headers)
     console.log("**********************************************")
  } else  {
    console.log("**********************************************")
    console.log("Final Body", options.body)
    console.log("Headers", options.headers)
    console.log("**********************************************")
  }
  return(localFetch(chosenURI, options))
}
function parseHeaders(rawHeaders) {
  const headers = new Headers();
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
    const parts = line.split(':');
    const key = parts.shift().trim();

    if (key) {
      const value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
}

function localFetch(input, init) {
  return new Promise(function (resolve, reject) {
    const request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new exports.DOMException('Aborted', 'AbortError'));
    }

    const xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function () {
      const options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      console.log("****** Made it this far?")
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      const body = 'response' in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, options));
    };

    xhr.onerror = function (e) {
      console.log("Thjere was an errror",e)
      reject(new TypeError('Network request failed'));
    };

    xhr.ontimeout = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.onabort = function () {
      reject(new exports.DOMException('Aborted', 'AbortError'));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr ) {
      xhr.responseType = 'blob';
    }

    request.headers.forEach(function (value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  });
}


export { ReactNativeFile } from './validators'
