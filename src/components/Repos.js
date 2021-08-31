import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
    //Getting the repos json
    const repos = useContext(GithubContext).repos;
    //Getting count of languages in repos of the user
    let languages = repos.reduce((occurences, item) => {
        const { language, stargazers_count } = item;
        if (!language) return occurences;
        if (!occurences[language]) occurences[language] = { label: language, value: 1, stars: stargazers_count };
        else
            occurences[language] = {
                ...occurences[language],
                value: occurences[language].value + 1,
                stars: occurences[language].stars + stargazers_count,
            };
        return occurences;
    }, {});
    //Getting the top 5 languages from that "languages" object as it might happen the user could have more than 5 languages and the graph end up becoming a congested one
    const mostUsedLanguages = Object.values(languages)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    //Getting the top 5 starred languages from
    const mostStarredLanguages = Object.values(languages)
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 5)
        .map((item) => {
            return { ...item, value: item.stars };
        });
    // Top 5 most starred repos
    const popularReposNames = repos
        .sort((a, b) => {
            return b.stargazers_count - a.stargazers_count;
        })
        .slice(0, 5)
        .map((item) => {
            return { label: item.name, value: item.stargazers_count };
        });
    // Top 5 most forked repos
    const mostForkedReposNames = repos
        .sort((a, b) => {
            return b.forks_count - a.forks_count;
        })
        .slice(0, 5)
        .map((item) => {
            return { label: item.name, value: item.forks_count };
        });

    return (
        <section className="section">
            <Wrapper className="section-center">
                <Pie3D data={mostUsedLanguages} />
                <Column3D data={popularReposNames} />
                <Doughnut2D data={mostStarredLanguages} />
                <Bar3D data={mostForkedReposNames} />
            </Wrapper>
        </section>
    );
};

// !important should be avoided in regular css as this might lead to confusions but here I used it for the purpose of overriding the default inline styling from the library
const Wrapper = styled.div`
    display: grid;
    justify-items: center;
    gap: 2rem;
    @media (min-width: 800px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1200px) {
        grid-template-columns: 2fr 3fr;
    }

    div {
        width: 100% !important;
    }
    .fusioncharts-container {
        width: 100% !important;
    }
    svg {
        width: 100% !important;
        border-radius: var(--radius) !important;
    }
`;

export default Repos;
