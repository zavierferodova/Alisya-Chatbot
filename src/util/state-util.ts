import State from '../model/state';

const getStateConfig = async () => {
  return await State.findByPk(1);
};

const updateTakeoverState = async (status: boolean) => {
  const state = await getStateConfig();
  return await state?.update({
    takeover: status
  });
};

const updatePublicFunctionState = async (status: boolean) => {
  const state = await getStateConfig();
  return await state?.update({
    publicFunction: status
  });
};

export { getStateConfig, updateTakeoverState, updatePublicFunctionState };
