import React from 'react';
import clsx from 'clsx';
import styles from './BuildIt.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

const DependencyList = [
  {
    title: 'CLI',
    Svg: require('../../static/img/cli.svg').default,
    url: "/docs/how-to-cli",
    desc: "Building Tools"
  },
  {
    title: 'Embedded',
    Svg: require('../../static/img/cpu.svg').default,
    url: "/docs/how-to-embedded",
    desc: "Built your IoT"
  },
  {
    title: 'AI',
    Svg: require('../../static/img/brain.svg').default,
    url: "/docs/how-to-ai",
    desc: "Build your SkyNet"
  },
  {
    title: 'Quantum',
    Svg: require('../../static/img/stem.svg').default,
    url: "/docs/how-to-quantum",
    desc: "Hack Pentagon"
  }
];

function Feature({Svg, path, title, url, desc}) {
  return (
    <div className={clsx('col col--3')}>
        <div className="text--center">
          { path && <img className={styles.dependencySvg} src={useBaseUrl(path)} alt={title}/> }
          { Svg && <Svg className={styles.dependencySvg} alt={title} />}
        </div>
        <div className="text--center padding-horiz--md">
          <p className="text--bold text--secondary">{title}</p>
        </div>
       <div className="text--center"> 
       <Link
            className="button button--secondary button--lg"
            to={url}>
            {desc}
        </Link>
       </div>
      </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <h1 className="text--center text--primary">Build it in Mana 🏗️</h1>
      <section className={styles.dependencies}>
        <div className="container">
          <div className="row">
            {DependencyList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>

  );
}