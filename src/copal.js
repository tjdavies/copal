export function createStore(rawActions, update){
    let state = {};
    let actions = {};

    const makeAction = (a,name) => (...args) => {
      const response = a(action({ state, effects: [] }),...args).fold();
      state = response.state
      response.effects.map(e => e(response.state, actions));
      update(state, actions)
    };

    for (var key in rawActions) {
        actions[key] = makeAction(rawActions[key],key);
    }
    return actions;
}

function action(s) {
  return {
    map: f => action({ effects: s.effects, state: f(s.state) }),
    addEffect: e => action({ effects: [...s.effects, e], state: s.state }),
    chain: (a, ...args) => a(action(s), ...args),
    log: () => action(log(s)),
    fold: () => s,
  };
}

export function log(t){
    console.log(t);
    return t;
}