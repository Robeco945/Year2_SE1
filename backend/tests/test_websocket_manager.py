"""Tests for websocket_manager.py — ConnectionManager connect/disconnect/send."""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from websocket_manager import ConnectionManager


@pytest.fixture
def mgr():
    """Fresh ConnectionManager for each test."""
    return ConnectionManager()


@pytest.mark.asyncio
async def test_connect_accepts_and_stores(mgr):
    """connect() should call accept() and store the websocket."""
    ws = AsyncMock()
    await mgr.connect(42, ws)
    ws.accept.assert_awaited_once()
    assert mgr.active_connections[42] is ws


@pytest.mark.asyncio
async def test_disconnect_removes_connection(mgr):
    """disconnect() should remove the user from active_connections."""
    ws = AsyncMock()
    await mgr.connect(42, ws)
    mgr.disconnect(42)
    assert 42 not in mgr.active_connections


def test_disconnect_nonexistent_user(mgr):
    """disconnect() should not raise for an unknown user_id."""
    mgr.disconnect(999)  # no error


@pytest.mark.asyncio
async def test_send_to_user_online(mgr):
    """send_to_user() should call send_json when user is connected."""
    ws = AsyncMock()
    await mgr.connect(1, ws)
    await mgr.send_to_user(1, {"msg": "hello"})
    ws.send_json.assert_awaited_once_with({"msg": "hello"})


@pytest.mark.asyncio
async def test_send_to_user_offline(mgr):
    """send_to_user() should silently drop when user is not connected."""
    await mgr.send_to_user(999, {"msg": "dropped"})  # no error


@pytest.mark.asyncio
async def test_send_to_user_error_disconnects(mgr):
    """send_to_user() should disconnect user when send_json raises."""
    ws = AsyncMock()
    ws.send_json.side_effect = RuntimeError("connection lost")
    await mgr.connect(1, ws)
    await mgr.send_to_user(1, {"msg": "boom"})
    assert 1 not in mgr.active_connections
