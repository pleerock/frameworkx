import {SearchType} from "../model/Search";

/**
 * Declarations for Search.
 */
export type SearchDeclaration = {

    queries: {

        /**
         * Searches in anything we have.
         */
        search(args: { keyword: string }): SearchType[]

    }

}