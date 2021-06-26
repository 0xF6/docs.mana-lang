import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import HeroHome from "../partials/HeroHome";

import Separator from "../partials/Separator";

import BuildIt from '../partials/BuildIt';

import AOS from "aos";
import "aos/dist/aos.css";
import "../css/tailwind.css";

function Home() {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Awesome Firestore based CMS">

            <div className="flex flex-col min-h-screen overflow-hidden">
                <main className="flex-grow">
                    <HeroHome/>
                    <Separator/>
                    <br/>
                    <BuildIt />
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </main>

            </div>
        </Layout>
    );
}

export default Home;