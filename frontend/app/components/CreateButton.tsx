"use client"
export default function CreateButton({onClick}:{onClick: ()=>void}){
    return <div>
        <button onClick={onClick}>Create Team</button>
    </div>
}