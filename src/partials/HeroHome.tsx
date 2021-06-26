import React from "react";
import { ThreeJSAnimationShader } from "../shape/ThreeJSAnimationShader";
import HeroButtons from "./HeroButtons";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from '@docusaurus/Link';
import styles from './../pages/index.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

function HeroHome({}) {
    const {siteConfig} = useDocusaurusContext();

    return (
        <section className="relative">

            <BrowserOnly
                fallback={<canvas style={{
                    height: "1000px",
                    width: "100vh",
                    maxHeight: "1000px",
                    position: "fixed",
                    transform: `translateY(60px)`,
                    top: 0,
                    zIndex: -10
                }}/>}>
                {() => <ThreeJSAnimationShader/>}
            </BrowserOnly>

            <header className={clsx('', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">
                is an open source high-level strictly-typed programming language with a standalone OS, arm and quantum computing support.
                </p>
                <div className={styles.buttons}>
                <Link
                    className="button button--secondary button--lg"
                    to="/docs/intro">
                    Go to Introduction
                </Link>
                </div>
            </div>
    </header>

        </section>
    );
}

export default HeroHome;