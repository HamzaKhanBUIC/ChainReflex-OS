import pytest


def test_core_engine_boot():
    """
    Asserts that the core engine and gateway can initialize without throwing
    an import or environment error.
    """
    try:
        import src.gateway.api
        import src.core.engine
        import src.chains.router
        import src.security.auditor
    except ImportError as e:
        pytest.fail(f"OS/Engine failed to boot due to import error: {e}")
    except Exception as e:
        pytest.fail(f"OS/Engine failed to boot due to an unexpected error: {e}")

    assert True
