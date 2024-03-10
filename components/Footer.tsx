import React from 'react';
import { NextPage } from 'next';
import { footerList1, footerList2, footerList3 } from '../utils/constants';
import LanguageSwitcher from "../utils/I18Switch";

const List = ({ items, mt }: { items: string[], mt: Boolean }) => (
    <div className={`flex flex-wrap gap-2 ${mt && 'mt-5'}`}>
        {items.map((item: string) => (
            <p key={item} className='text-gray-400 text-sm  hover:underline cursor-pointer' >
                {item}
            </p>
        ))}
    </div>
);

const Footer: NextPage = () => (
    <div className='mt-6 hidden xl:block flex'>
        {/*<List items={footerList1} mt={false} />*/}
        {/*<List items={footerList2} mt />*/}
        {/*<List items={footerList3} mt />*/}
        <p className='text-gray-400 text-sm mt-5'>© 2024 TikTik</p>
    </div>
);

export default Footer;