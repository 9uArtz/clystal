export function create(msg : string, context? : {})
{
    return {
        msg: msg,
        context: context
    }
}
