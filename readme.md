<!-- {"s_msg":"this file was automatically generated","s_by":"f_generate_markdown.module.js","s_ts_created":"Tue Dec 05 2023 01:46:48 GMT+0100 (Central European Standard Time)","n_ts_created":1701737208731} -->
# node from deno
## how it works
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
    f_s_function_body,
} from "./mod.js"

```
## call a simple function in node
```javascript
let s_process_plattform = await f_s_from_node_command(
    `
    console.log(process.platform) //note the console log is the 'return' value!
    `
);
console.log({s_process_plattform}) // { s_process_plattform: "linux\n" }


```
## syntax highlighing
if we want syntax highlighting we can use a function to convert a js function body to a string
```javascript
let s2 = await f_s_from_node_command(
    f_s_function_body(()=>{
        console.log(process.platform) //note the console log is the 'return' value!
    })
);
console.log({s2}) // { s_process_plattform: "linux\n" }


```
## non primitive return values
by console.log(JSON.stringify(value))
we can stringify the value in node and parse it in denojs
this way we can pass object from node to js
```javascript
let o_os = JSON.parse(
    await f_s_from_node_command(
        f_s_function_body(
            ()=>{
                let o = require('os');
                console.log(JSON.stringify(o))
            }
        )
    )
)
console.log(o_os)

```
## node modules
we can also require modules in node!
```javascript
let a_s_entry = JSON.parse(
    await f_s_from_node_command(
        f_s_function_body(()=>{

        const o_fs = require('fs');

        o_fs.readdir('./', (err, files) => {
            console.log(JSON.stringify(files))
        })
    })
    )
)

```
## command output
we can of course also get the typed arrays of the output
we can also require modules in node!
```javascript


```
## type 'module'
to run a function as a type module, we have to pass --input-type=module as an argument
of course we cannot have syntax highlighting for stuff like import mod from 'mod'
we will encounter the problem of 'import val from 'module_name' which will throw a
deno parse error
```javascript
let a_n_u8__random = await f_a_n_u8__stdout__from_node_command(
    [
        `import random from 'random'`, 
        f_s_function_body(()=>{
            //this_comment_will_get_removed_when_run_in_node 
            console.log(
                new Array(10).fill(0).map(n=>{random.int(0, 255)})
            )
        })
    ].join('\n')
    ['--input-type=module']
)
console.log({a_n_u8__random})


```
## non installed modules
if the node code throws an error deno will also throw an error
```javascript
let s_modo_locations = 
    await f_s_from_node_command(
        f_s_function_body(()=>{
            const o_modo = require('modo');
            console.log((o_modo.locations))

        })
    )
console.log({s_modo_locations})//Error: Cannot find module 'modo'



```
## use input data
```javascript
let o_input = {n:1, s:'test'};
let a_v_arg = [1, 'test']
let s = 
    await f_s_from_node_command(
        [
            `let o_input = ${JSON.stringify(o_input)}`, 
            f_s_function_body(()=>{
                o_input.n = 420;
                console.log(o_input)
            })
        ].join('\n'),
    
)
console.log({s})//{ s: "{ n: 420, s: 'test' }\n" }
console.log(o_input)//{ n: 1, s: "test" }
```