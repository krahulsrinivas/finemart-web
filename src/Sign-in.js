import React, { useState } from 'react';


const Signin = ({ ...props }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { cred } = props;
    const handleSubmit = (e) => {
        e.preventDefault()
        if (email.trim() === '' || password.trim() === '') {
            alert('PLease enter all Fields')
        } else {
            cred(email, password);
        }
    }
    return (
        <div >
            <center>
                <div className="ui inverted segment" style={{ marginTop: "50px", marginBottom: "50px", marginLeft: "500px", marginRight: "500px" }}>
                    <h1>FineMart Store</h1>
                </div>
                <div className="ui inverted segment" style={{ marginLeft: "500px", marginRight: "500px" }}>
                    <form className="ui form" onSubmit={(event) => event.preventDefault()} style={{ marginBottom: '60px' }}>
                        <div style={{ margin: '10px', fontSize: '35px' }}><p>Login</p></div>
                        <div className="ui container">
                            <div className="ui large input" style={{ margin: '10px',width:"350px"}} >
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <div className="ui large input" style={{ margin: '10px',width:"350px" }}>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '40px' }}>
                                <button className="ui inverted teal button" onClick={handleSubmit}>
                                    Login
                            </button>
                            </div>
                        </div>
                    </form>
                </div>
            </center>
        </div>
    );
}

export default Signin