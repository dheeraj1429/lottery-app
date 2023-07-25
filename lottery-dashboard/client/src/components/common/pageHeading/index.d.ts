import React from 'react';

export type Props = {
   pageName: string;
   subHeading?: string;
   para?: string;
   innerProps?: React.ReactNode;
   menu?: boolean?;
   heading: string;
};
export type StateType = null | HTMLElement;
export type MouseHandlerType = React.MouseEvent<HTMLButtonElement>;
