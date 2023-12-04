<!-- {"s_msg":"this file was automatically generated","s_by":"f_generate_markdown.module.js","s_ts_created":"Tue Dec 05 2023 00:38:09 GMT+0100 (Central European Standard Time)","n_ts_created":1701733089318} -->
# node from deno
1. spawns a 'node' command in deno
2. writes the function to the stdin
3. gets the full stdout
4. done!
```javascript

```
## import
```javascript
import {
    f_s_version_node, 
    f_o_output_from_node_command,
    f_a_n_u8__stdout__from_node_command,
    f_s_from_node_command,
} from "./mod.js"


```
## call a simple function in node
```javascript
let s_process_plattform = await f_s_from_node_command(
    ()=>{
        console.log(process.platform) //note the console log is the 'return' value!
    }
);
console.log({s_process_plattform}) // { s_process_plattform: "linux\n" }


```
## non primitive return values
by console.log(JSON.stringify(value))
we can stringify the value in node and parse it in denojs
this way we can pass object from node to js
```javascript
let o_os = JSON.parse(
    await f_s_from_node_command(
        ()=>{
            let o = require('os');
            console.log(JSON.stringify(o))
        }
    )
)
console.log(o_os)

```
## node modules
we can also require modules in node!
```javascript
let a_s_entry = JSON.parse(
    await f_s_from_node_command(()=>{

        const o_fs = require('fs');

        o_fs.readdir('./', (err, files) => {
            console.log(JSON.stringify(files))
        })
    })
)

```
## command output
we can of course also get the typed arrays of the output
we can also require modules in node!
```javascript


```
## type 'module'
to run a function as a type module, we can pass a true boolean as the second argument,
this will add the flag '--input-type=module' to the node command
of course we will encounter the problem of 'import val from 'module_name' which will throw a deno parse error
'error: The module's source code could not be parsed: 'import', and 'export' cannot be used outside of module code'
this can be solved by prefixing the line with a special comment which will get replaced by an empty string ''
and therefore will be removed in the executed nodejs code!
```javascript
let a_n_u8__random = await f_a_n_u8__stdout__from_node_command(
    ()=>{
        //this_comment_will_get_removed_when_run_in_node import random from 'random'
        console.log(
            new Array(10).fill(0).map(n=>{random.int(0, 255)})
        )
    }, 
    true
)
console.log({a_n_u8__random})


```
## non installed modules
if the node code throws an error deno will also throw an error
```javascript
let s_modo_locations = 
    await f_s_from_node_command(()=>{
        const o_modo = require('modo');
        console.log((o_modo.locations))

    })
console.log({s_modo_locations})//Error: Cannot find module 'modo'

```