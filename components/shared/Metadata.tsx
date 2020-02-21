import { Component } from 'react';
import Head from 'next/head';

export type MetadataProps = {
    title ?: string;
    description ?: string;
    image ?: string;
};

export type MetadataState = { };

export const DefaultDescription = `Download the latest snapshot of the mainnet and testnet for Divi`;

export class Metadata extends Component<MetadataProps, MetadataState> {
    public constructor(props) {
        super(props);
        this.state = { };
    }

    public render() {
        return(
            <Head>
            <title>{this.props.title ? this.props.title : `Divi | NetworkSnapshots`}</title>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="author" content="Divi"/>
            <meta name="description" content={this.props.description ? this.props.description : DefaultDescription}/>

            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={this.props.title ? this.props.title : `Divi | NetworkSnapshots`}/>
            <meta name="twitter:description" content={this.props.description ? this.props.description : DefaultDescription}/>
            <meta name="twitter:site" content="@diviproject"/>
            <meta name="twitter:creator" content="@diviproject"/>

            <meta property="og:title" content={this.props.title ? this.props.title : `Divi | NetworkSnapshots`}/>
            <meta property="og:image" content={this.props.image ? this.props.image : ``}/>
            <meta property="og:description" content={this.props.description ? this.props.description : DefaultDescription}/>

            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" type="image/png" href={require('../image/logo.png')}/>

            <link href="https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,600,700|Oswald:200,300,400,600,700" rel="stylesheet"/>

            <style>{`
            body, html {
                width: 100vw;
                height: 100vh;
                margin: 0;
                padding: 0;
                font-family: 'Montserrat', monospace;
                -webkit-font-smoothing: antialiased;
                text-rendering: optimizelegibility;
                letter-spacing: 1px;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                text-decoration: none;
                outline: none;
            }

            input, textarea, button {
                font-family: inherit;
            }`}</style>
        </Head>
        )
    }
}