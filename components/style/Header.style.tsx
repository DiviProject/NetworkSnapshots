import styled from 'styled-components';
import { HeaderColor } from './Color.style';

export const HeaderStyled = styled.header`
    width: 100%;
    height: 70px;
    background: ${HeaderColor};

    div.container-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        max-width: 1200px;
        margin: auto;

        a.brand {
            display: flex;
            align-items: center;
            padding: 0 15px;
            height: 100%;
            color: white;

            img {
                width: 50px;
                height: 50px;
                margin: 0 15px 0 0;
            }

            div.brand-tagline {
                display: flex;
                align-items: center;
            }

            h1 {
                font-weight: 300;
                font-size: 24px;
                letter-spacing: 2.5px;
            }

            @media (max-width: 640px) {
                justify-content: center;

                h1 {
                    font-size: 18px;
                }
            }
        }
    }
`;