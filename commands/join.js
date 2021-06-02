import React, {useEffect, useState} from "react";
import useHyper from "../hyper/useHyper.js";
import {SessionInfo, TitleCard} from '../components/Title'
import PropTypes from "prop-types";
import FileTree from "../components/FileTree";
import {Text} from "ink";
import Loader from "../components/Loader";

/// Joins an existing portal using a given `sessionId`
const Client = ({ sessionId }) => {
  const [registryTree, setRegistryTree] = useState([])
  const { hyper, error, loading } = useHyper(sessionId, ({registry, eventLog}) => {
    const process = (data) => {
      registry.parseEvt(JSON.parse(data))
    }

    // sync down and preload
    eventLog.download()

    // reconstruct file registry from event stream
    const dataPromises = []
    for (let i = 0; i < eventLog.length; i++) {
      dataPromises.push(eventLog.get(i))
    }
    Promise.all(dataPromises)
      .then(data => data.forEach(process))
      .then(() => {
        // setup registry tree
        setRegistryTree(registry.getTree())

        // if we get a new block
        eventLog.on('append', async () => {
          const data = await eventLog.get(eventLog.length - 1)
          process(data)
          setRegistryTree(registry.getTree())
        })

        eventLog.on('close', () => {
          console.log('stream closed')
        })

        // TODO: handle more feed events here
        // https://github.com/hypercore-protocol/hypercore#feedondownload-index-data
      })
  })

  if (loading) {
    return <Loader status="Initializing Hyperspace..." />
  }

  if (error) {
    return <Text>
      <Text color="red">Error connecting to hypercore: </Text>
      <Text>{error}</Text>
    </Text>
  }

  return (
    <>
      <TitleCard/>
      <FileTree registry={registryTree}/>
      <SessionInfo sessionId={sessionId}/>
    </>
  )
}

Client.propTypes = {
  sessionId: PropTypes.string.isRequired,
};

Client.positionalArgs = ['sessionId'];
export default Client