#!/bin/bash

echo "========= Ethereum Kurtosis Network Healthcheck ========="

# Parallel arrays: names and ports
NAMES=("cl-1-teku-geth" "cl-2-teku-geth" "cl-3-lighthouse-geth") # name according to the Kurtosis network
PORTS=("127.0.0.1:60921" "127.0.0.1:61251" "127.0.0.1:61429") # port according to the Kurtosis network

for i in "${!NAMES[@]}"; do
  NAME="${NAMES[$i]}"
  HOSTPORT="${PORTS[$i]}"
  echo
  echo "🔍 Checking $NAME at http://$HOSTPORT"

  # Peer Count
  PEERS=$(curl -s "http://$HOSTPORT/eth/v1/node/peer_count" | jq -r '.data.connected // "N/A"')
  echo "👥 Peers: $PEERS"

  # Finality Checkpoints
  FINALITY=$(curl -s "http://$HOSTPORT/eth/v1/beacon/states/head/finality_checkpoints")
  JUSTIFIED_EPOCH=$(echo "$FINALITY" | jq -r '.data.current_justified.epoch // "N/A"')
  FINALIZED_EPOCH=$(echo "$FINALITY" | jq -r '.data.finalized.epoch // "N/A"')
  echo "⛓ Justified Epoch: $JUSTIFIED_EPOCH | Finalized Epoch: $FINALIZED_EPOCH"

  # Head Block
  HEAD_SLOT=$(curl -s "http://$HOSTPORT/eth/v1/beacon/headers/head" | jq -r '.data.header.message.slot // "N/A"')
  echo "🔗 Head Slot: $HEAD_SLOT"

  # Attestations
  echo "🧾 Recent Attestations:"
  curl -s "http://$HOSTPORT/eth/v1/beacon/pool/attestations" | jq '[.data[] | {slot, index}]' | head -n 10
done

echo
echo "✅ Healthcheck finished."