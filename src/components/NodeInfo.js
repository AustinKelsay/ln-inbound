import React from 'react'

const NodeInfo = ({alias, identity_pubkey, uris}) => {
    
    const parseHost = () => {
      return uris[0].split('@')[1]
    }
    
    return (
        <div className='text-xl'>
            <div>Pubkey: {identity_pubkey}</div>
            <div>Alias: {alias}</div>
            <div>Host: {parseHost()}</div>
        </div>
    )
}

export default NodeInfo