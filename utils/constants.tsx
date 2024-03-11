import { BsCode, BsEmojiSunglasses } from 'react-icons/bs';
import { GiCakeSlice, GiGalaxy, GiLipstick } from 'react-icons/gi';
import { FaPaw, FaMedal, FaGamepad } from 'react-icons/fa';
import {useTranslation} from "next-i18next";


export const useTopics = () => {
  const { t } = useTranslation('common');

  const topics = [
    {
      id:"development",
      name: t('common:Development'),
      icon: <BsCode />,
    },
    {
      id:"comedy",
      name: t('common:Comedy'),
      icon: <BsEmojiSunglasses />,
    },
    {
      id:"gaming",
      name: t('common:Gaming'),
      icon: <FaGamepad />,
    },
    {
      id:"food",
      name: t('common:Food'),
      icon: <GiCakeSlice />,
    },
    {
      id:"dance",
      name: t('common:Dance'),
      icon: <GiGalaxy />,
    },
    {
      id:"beauty",
      name: t('common:Beauty'),
      icon: <GiLipstick />,
    },
    {
      id:"animals",
      name: t('common:Animals'),
      icon: <FaPaw />,
    },
    {
      id:"sports",
      name: t('common:Sports'),
      icon: <FaMedal />,
    },

  ];

  return topics;
};




// export const topics = [
//   {
//     name: 'development',
//     icon: <BsCode />,
//   },
//   {
//     name: 'comedy',
//     icon: <BsEmojiSunglasses />,
//   },
//   {
//     name: 'gaming',
//     icon: <FaGamepad />,
//   },
//   {
//     name: 'food',
//     icon: <GiCakeSlice />,
//   },
//   {
//     name: 'dance',
//     icon: <GiGalaxy />,
//   },
//   {
//     name: 'beauty',
//     icon: <GiLipstick />,
//   },
//   {
//     name: 'animals',
//     icon: <FaPaw />,
//   },
//   {
//     name: 'sports',
//     icon: <FaMedal />,
//   },
// ];

export const footerList1 = ['About', 'Newsroom', 'Store', 'Contact', 'Carrers', 'ByteDance', 'Creator Directory']
export const footerList2 = [ 'TikTik for Good','Advertise','Developers','Transparency','TikTik Rewards' ]
export const footerList3 = [ 'Help', 'Safety', 'Terms', 'Privacy', 'Creator Portal', 'Community Guidelines' ]