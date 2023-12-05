//readme.md:start
//md: # node from deno
//md: ## how it works
//md: 1. spawns a 'node' command in deno
//md: 2. writes the function to the stdin
//md: 3. gets the full stdout
//md: 4. done!

//md: ## import
import {
    f_s_version_node, 
    f_o_output_from_node_command,
    f_a_n_u8__stdout__from_node_command,
    f_s_from_node_command,
    f_s_function_body,
} from "./mod.js"

//md: ## call a simple function in node
let s_process_plattform = await f_s_from_node_command(
    `
    console.log(process.platform) //note the console log is the 'return' value!
    `
);
console.log({s_process_plattform}) // { s_process_plattform: "linux\n" }


//md: ## syntax highlighing
//md: if we want syntax highlighting we can use a function to convert a js function body to a string
let s2 = await f_s_from_node_command(
    f_s_function_body(()=>{
        console.log(process.platform) //note the console log is the 'return' value!
    })
);
console.log({s2}) // { s_process_plattform: "linux\n" }


//md: ## non primitive return values 
//md: by console.log(JSON.stringify(value))
//md: we can stringify the value in node and parse it in denojs
//md: this way we can pass object from node to js
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

//md: ## node modules
//md: we can also require modules in node!
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

//md: ## command output 
//md: we can of course also get the typed arrays of the output
//md: we can also require modules in node!


//md: ## type 'module' 
//md: to run a function as a type module, we have to pass --input-type=module as an argument
//md: of course we cannot have syntax highlighting for stuff like import mod from 'mod' 
//md: we will encounter the problem of 'import val from 'module_name' which will throw a
//md: deno parse error
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


//md: ## non installed modules
//md: if the node code throws an error deno will also throw an error
let s_modo_locations = 
    await f_s_from_node_command(
        f_s_function_body(()=>{
            const o_modo = require('modo');
            console.log((o_modo.locations))

        })
    )
console.log({s_modo_locations})//Error: Cannot find module 'modo'



//md: ## use input data 
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
//readme.md:end