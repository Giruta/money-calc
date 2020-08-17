import React, {Component} from 'react';
import Total from "./components/total/Total";
import History from "./components/history/History";
import Operation from "./components/operation/Operation";

class App extends Component {

  state = {
    transactions: JSON.parse(localStorage.getItem('calcMoney')) || [],
    description: '',
    amount: '',
    resultIncome: 0,
    resultExpenses: 0,
    totalBalance: 0,
  }

  componentWillMount() {
    this.getTotalBalace();
  }

  componentDidUpdate() {
    this.addStorage();
  }

  addTransaction = add => {

    const transactions = [...this.state.transactions]; // копируем стейт, массив

    const transaction = {
      id: `cmr${(+new Date).toString(16)}`,
      description: this.state.description,
      amount: parseFloat(this.state.amount),
      add
    }

    transactions.push(transaction);

    this.setState({
      transactions,
      description: '',
      amount: '',
    }, this.getTotalBalace);
  }

  addAmount = e => {
    this.setState({amount: e.target.value})
    console.log(this.state)
  }

  addDescription = e => {
    this.setState({description: e.target.value})
    console.log(this.state)
  }

  getIncome = () => this.state.transactions
    .filter(item => item.add)
    .reduce((acc, item) => item.amount + acc, 0)

  getExpenses = () => this.state.transactions
    .filter(item => !item.add)
    .reduce((acc, item) => item.amount + acc, 0)

  getTotalBalace () {
    const resultIncome = this.getIncome();
    const resultExpenses = this.getExpenses();

    const totalBalance = resultIncome - resultExpenses;

    this.setState({
      resultIncome,
      resultExpenses,
      totalBalance
    })
  }

  addStorage() {
    localStorage.setItem('calcMoney', JSON.stringify(this.state.transactions))
  }

  delTransaction = key => {
    const transactions = this.state.transactions.filter(item => item.id !== key)
    this.setState({ transactions }, this.getTotalBalace)
  }

  render() {
      return (
          <>
              <header>
                  <h1>Кошелек</h1>
                  <h2>Калькулятор расходов</h2>
              </header>

              <main>
                  <div className="container">
                      <Total
                        resultExpenses={this.state.resultExpenses}
                        resultIncome={this.state.resultIncome}
                        totalBalance={this.state.totalBalance}
                      />
                      <History
                        transactions={this.state.transactions}
                        delTransaction={this.delTransaction}
                      />
                      <Operation
                        addTransaction={this.addTransaction}
                        addAmount={this.addAmount}
                        addDescription={this.addDescription}
                        description={this.state.description}
                        amount={this.state.amount}
                      />
                  </div>
              </main>
          </>
      );
  }


}

export default App;
