import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);
    const [requests, setRequests] = useState(false);
    const [error, setError] = useState({ show: false, msg: "" });
    const [loading, setLoading] = useState(false);
    const searchGithubUser = async (user) => {
        setError({ show: false, msg: "" });
        //When the handlesubmit triggers the serachGithubUser function and then the gif will be shown
        setLoading(true);
        const res = await axios(`${rootUrl}/users/${user}`).catch((error) => console.log(error));
        if (res) {
            setGithubUser(res.data);
            const { login, followers_url } = res.data;
            console.log(login, followers_url);
            //getting the repos for the username
            axios(`${rootUrl}/users/${login}/repos?per_page=100`)
                .then(({ data }) => setRepos(data))
                .catch((errMsg) => console.log(errMsg));
            //getting the followers for the username
            axios(`${followers_url}?per_page=100`)
                .then(({ data }) => setFollowers(data))
                .catch((errMsg) => console.log(errMsg));
        } else {
            setError({ show: true, msg: "User does not exist with the entered username !" });
        }
        checkRequests();
        //After the response is received from the server then we will stop showing the loading image
        setLoading(false);
    };
    const checkRequests = () => {
        axios(rootUrl + "/rate_limit")
            .then(({ data }) => {
                let {
                    rate: { remaining },
                } = data;
                setRequests(remaining);
                if (remaining === 0) {
                    setError({ show: true, msg: "Hourly requests limit has been exhausted !" });
                }
            })
            .catch((err) => console.log(err));
    };
    useEffect(checkRequests, []);
    return (
        <GithubContext.Provider value={{ githubUser, repos, followers, requests, error, searchGithubUser, loading }}>
            {children}
        </GithubContext.Provider>
    );
};

export { GithubProvider, GithubContext };
