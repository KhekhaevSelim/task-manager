import AppWithRedux from "./AppWithRedux";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Provider} from "react-redux";
import {ReduxStoreProviderDecorator} from "../DAL/ReduxStoreProviderDecorator.stories";

export default {
    title: 'TODOLISTS/AppWithRedux',
    component: AppWithRedux,
    decorators : [ReduxStoreProviderDecorator]
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

} as ComponentMeta<typeof AppWithRedux>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux />
export const AppWithReduxStory = Template.bind({});