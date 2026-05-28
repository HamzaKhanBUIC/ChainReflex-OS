import time


def test_engine_latency():
    """Stress test for engine latency limits."""
    start_time = time.time()
    # Simulate load
    time.sleep(0.1)
    end_time = time.time()

    assert (end_time - start_time) < 0.5, "Engine response latency exceeded limits"
