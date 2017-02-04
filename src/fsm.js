class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error(`Please, give me a config`);

        this._initialState = config.initial;
        this._states = config.states;

        this._stateHistory = [];
        this._editedStates = [];

        this._state = config.initial;

        this._transitions = {};
        Object.keys(this._states).forEach((state) => {
            Object.assign(this._transitions, this._states[state].transitions);
        })
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this._states[state])
            throw new Error(`What do you mean?`);

        this._stateHistory.push(this._state);
        this._editedStates.length = 0;
        this._state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this._transitions[event])
            throw new Error(`There is no such transition`);
        if (!this._states[this._state].transitions[event])
            throw new Error(`There is no such transition in current state`);

        this._stateHistory.push(this._state);
        this._editedStates.length = 0;
        this._state = this._states[this._state].transitions[event];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._stateHistory.push(this._state);
        this._editedStates.length = 0;
        this._state = this._initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) return Object.keys(this._states);
        if (!this._transitions[event]) return [];

        return Object
                .keys(this._states)
                .filter((state) => !!this._states[state].transitions[event]);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this._stateHistory.length) return false;

        this._editedStates.push(this._state);
        this._state = this._stateHistory.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this._editedStates.length) return false;

        this._stateHistory.push(this._state);
        this._state = this._editedStates.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._stateHistory.length = 0;
        this._editedStates.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
