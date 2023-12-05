import {
    f_o_command 
}from "https://deno.land/x/o_command@0.9/mod.js"

let o_text_encoder = new TextEncoder();
let o_text_decoder = new TextDecoder();
let s_name_binary = 'node';


let f_s_function_body = function(f){
    let s_f_body = f.toString().split('\n').slice(1,-1).join('\n');
    return s_f_body;
}

let f_s_version_node = async function(){
    let s_command = `${s_name_binary} --version`;
    let a_v_arg = s_command.split(' ');
    const o_command = new Deno.Command(
        a_v_arg[0],
        {
            args: a_v_arg.slice(1),
            stdout: 'piped', 
            stderr: 'piped'
        },
    );
    const { code: n_code, stdout: a_n_u8__stdout, stderr: a_n_u8__stderr } = await o_command.output();
    
    if(n_code != 0 || a_n_u8__stderr.length > 0){
        throw Error(`n_return_code is ${n_code} from command '${s_command}', stderr: '${o_text_decoder.decode(a_n_u8__stderr)}'`)
    }
    return o_text_decoder.decode(a_n_u8__stdout);
}

let s_version_node = null;

try {
    s_version_node = await f_s_version_node();
} catch (error) {
    console.log(`the binary '${s_name_binary}' seems to not be installed please install it!`)
    console.log(`linux: apt install ${s_name_binary}`)
    console.log(`osx: brew install ${s_name_binary}`)
    console.log(`windows:sorry bill :(, so gates nid!`) 
}
let f_o_output_from_node_command = async function(
    s_function_body, 
    a_v_arg = []
){

    // console.log(s_f_node)
    // console.log(a_v_arg)
    let s_command = s_name_binary
    const o_command = new Deno.Command(
        s_command,
        {
            args: a_v_arg,
            stdin: "piped",
            stdout: "piped",
            stderr: 'piped'
        }
    );
    const o_proc_child = o_command.spawn();
    let o_writer = await (o_proc_child.stdin.getWriter())

    await o_writer.write(o_text_encoder.encode(s_function_body))
    await o_writer.close();

    const { code: n_return_code, stdout: a_n_u8__stdout, stderr: a_n_u8__stderr } = await o_proc_child.output();
    return {
        s_command: s_command,
        n_return_code, 
        a_n_u8__stdout, 
        a_n_u8__stderr
    }
}

let f_a_n_u8__stdout__from_node_command = async function(
    s_function_body, 
    a_v_arg = []
){

    let o = await f_o_output_from_node_command(s_function_body, a_v_arg);
    
    if(o.n_return_code != 0 || o.a_n_u8__stderr.length > 0){
        let s_error = `n_return_code is ${o.n_return_code} from command '${o.s_command}', stderr: '${o_text_decoder.decode(o.a_n_u8__stderr)}'`

        console.error(s_error)
        let s_stderr = o_text_decoder.decode(o.a_n_u8__stderr);
        let s_name_module = null;
        let s_start = `Error: Cannot find module`;
        
        let n_idx_start = s_stderr.indexOf(`Error: Cannot find module`)

        if(n_idx_start !=-1){
            s_stderr.split('\n').find(s=>{
                if(s.startsWith(s_start)){
                    s_name_module = s.substring(s_start.length);
                    return true
                }
                return false
            });

            // console.log(s_name_module)
            let s_expected = `yes`;
            let s_command_install = `npm install ${s_name_module}`; 
            let s_prompt_result = prompt(`it seems the nodejs module ${s_name_module} is not installed, 
            type '${s_expected}' to install it with the following command
                ${s_command_install}
            `);
            if(s_prompt_result == s_expected){
                var o_command = await f_o_command(
                    s_command_install,
                    async function(
                    s_partial_output,
                    a_n_u8__partial_output
                    ){
                        // s_partial_output contains the textdecoded TypedArray
                        // console.log('s_partial_output')
                        await Deno.writeAll(Deno.stdout, a_n_u8__partial_output)
                    }
                );
                console.log(o_command)
            }
        }
        throw Error(s_error)
    }
    return o.a_n_u8__stdout;
}
let f_s_from_node_command = async function(
    s_function_body, 
    a_v_arg = []
){

    let a_n_u8__stdout = await f_a_n_u8__stdout__from_node_command(
        s_function_body,
        a_v_arg
    );
    return o_text_decoder.decode(a_n_u8__stdout)
}



export {
    f_s_function_body,
    f_s_version_node, 
    f_o_output_from_node_command,
    f_a_n_u8__stdout__from_node_command,
    f_s_from_node_command,
}