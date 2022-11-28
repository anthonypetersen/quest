import { moduleParams } from "./quest.js";

export let localResults = {};
export let localTree = {};

export async function initialize() {
    
    localResults = localforage.createInstance({
        'name': "Quest",
        'storeName': moduleParams.name
    });
    
    localTree = localforage.createInstance({
        'name': "Quest",
        'storeName': moduleParams.name + "_tree"
    });
}

export function store() {

}

export function restore() {

}

export function updateTree() {

}