import { ResultType, youtube } from './index'

async function main(){



    const result = await youtube.search('ozuna', {
        type: ResultType.video
    }) 
        
}


main()