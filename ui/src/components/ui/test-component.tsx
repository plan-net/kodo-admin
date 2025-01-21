'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { client, home} from '../../../ui/src/lib/gen-api'

client.setConfig({
    baseUrl: 'http://localhost:3366',
})

export default function TestComponent() {
    const searchParams = useSearchParams()
    const selectedNodeId = searchParams.get('nodeId')


    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
                const response = await home();
                setData(response)
            // }
        }
        fetchData()
    }, [selectedNodeId])

    return (
        <div>
            <h1>Test Component</h1>
            {JSON.stringify(data?.data)}
        </div>
    )
}
