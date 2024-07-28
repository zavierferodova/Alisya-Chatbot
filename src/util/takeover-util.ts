import TakeOverConfig from "../model/takeover-config"
import { updateTakeoverState } from "./state-util"

const getTakeOverConfig = async () => {
    return await TakeOverConfig.findByPk(1)
}

const changeTakeOverState = async (status: boolean) => {
    return await updateTakeoverState(status)
}

const setTakeOverOwner = async (name: string | null) => {
    return await TakeOverConfig.update({ ownerName: name }, { where: { id: 1 } })
}

export {
    getTakeOverConfig,
    changeTakeOverState,
    setTakeOverOwner
}