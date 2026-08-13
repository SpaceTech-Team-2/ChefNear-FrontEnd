export default function Button(props :any){
    return <button className="bg-amber-400 hover:bg-amber-500  text-3xl text-center" type={props.type || "button"}>{props.text} </button>
}