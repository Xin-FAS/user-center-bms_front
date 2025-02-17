import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
    const copyright = `${new Date().getFullYear()} FAS出品`;
    return (
        <DefaultFooter
            copyright={copyright}
            style={{
                background: 'none',
            }}
            links={[
                {
                    key: 'blog',
                    title: 'Blog',
                    href: 'https://xin-fas.github.io/',
                    blankTarget: true,
                },
                {
                    key: 'github',
                    title: (
                        <span>
                            <GithubOutlined style={{ marginRight: '3px' }} />
                            FAS
                        </span>
                    ),
                    href: 'https://github.com/Xin-FAS/user-center-bms_front',
                    blankTarget: true,
                },
            ]}
        />
    );
};

export default Footer;
