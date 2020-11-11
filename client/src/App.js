import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import BlackjackContract from "./contracts/Blackjack.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
    state = { storageValue: 0, web3: null, accounts: null, contract: null, game: null , playerHand: [] };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

	    const gameNetwork = BlackjackContract.networks[networkId];
	    const gameInstance = new web3.eth.Contract(
		BlackjackContract.abi,
		gameNetwork && gameNetwork.address,
	    );
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance, game: gameInstance }, this.runExample);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    runExample = async () => {
        const { accounts, contract } = this.state;

        // Stores a given value, 5 by default.
        await contract.methods.set(5).send({ from: accounts[0] });

        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();

        // Update state with the result.
        this.setState({ storageValue: response });
    };

    initGame(event){
        const { accounts, game } = this.state;

        game.methods.initGame(0).send({ from: accounts[0] })
    };

    //newRound(event){
    //    const { accounts, game } = this.state;

    //    game.methods.newRound(0).send({ from: accounts[0] })
    //        .then(result => {
    //            return game.methods.getPlayerHand().call()
    //        }).then(result => {
    //		console.log(result)
    //            return this.setState({ playerHand: result })
    //        })
    //};

    newRound = async () => {
        const { accounts, game } = this.state;

        await game.methods.newRound(0).send({ from: accounts[0] });
    	
        const response = await game.methods.getPlayerHand().call();

        this.setState({ playerHand: response });

    	console.log(this.state.playerHand);
    };

    deal(event){
        const { accounts, contract } = this.state;

        var value = 3
        contract.methods.set(value).send({ from: accounts[0] })
            .then(result => {
                return contract.methods.get().call()
            }).then(result => {
                return this.setState({ storageValue: result })
            })
    };

    hit(event){
        const { accounts, contract } = this.state;

        var value = 3
        contract.methods.set(value).send({ from: accounts[0] })
            .then(result => {
                return contract.methods.get().call()
            }).then(result => {
                return this.setState({ storageValue: result })
            })
    };

    stand(event){
        const { accounts, contract } = this.state;

        var value = 7
        contract.methods.set(value).send({ from: accounts[0] })
            .then(result => {
                return contract.methods.get().call()
            }).then(result => {
                return this.setState({ storageValue: result })
            })
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
                <div className="App">
                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>
                <p>
                If your contracts compiled and migrated successfully, below will show
            a stored value of 5 (by default).
                </p>
                <p>
                Try changing the value stored on <strong>line 40</strong> of App.js.
                </p>
                <div>Player is: {this.state.playerHand}</div>
                <div>The stored value is: {this.state.storageValue}</div>

                <button onClick={this.initGame.bind(this)}>initGame</button>
                <button onClick={this.newRound.bind(this)}>newRound</button>
		<div/>
                <button onClick={this.deal.bind(this)}>Deal</button>
                <button onClick={this.hit.bind(this)}>Hit</button>
                <button onClick={this.stand.bind(this)}>Stand</button>
                </div>
        );
    }
}

export default App;
