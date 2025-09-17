#!/usr/bin/env python3
"""
Test script to verify that silent failures have been fixed in SD-Pinnokio components.

This script tests the key components to ensure they handle shell runner results
properly and don't fail silently when shell commands fail or timeout.
"""

import sys
import os
import traceback
from pathlib import Path

# Add the github_repo path to sys.path
github_repo_path = Path(__file__).parent / "github_repo"
sys.path.insert(0, str(github_repo_path))

def test_shell_runner_capture_output():
    """Test that ShellRunner handles capture_output=True properly."""
    print("=" * 60)
    print("TESTING: ShellRunner capture_output=True handling")
    print("=" * 60)
    
    try:
        from environment_management.shell_runner import ShellRunner
        
        # Create ShellRunner instance
        shell_runner = ShellRunner()
        
        print("✅ ShellRunner imported successfully")
        
        # Test 1: Valid command
        print("\nTest 1: Valid command with capture_output=True")
        result = shell_runner.run_command("echo 'test'", capture_output=True)
        
        if result is None:
            print("❌ FAIL: ShellRunner returned None for valid command")
            return False
        elif hasattr(result, 'returncode') and hasattr(result, 'stdout') and hasattr(result, 'stderr'):
            print(f"✅ PASS: Valid command returned proper result object")
            print(f"   Return code: {result.returncode}")
            print(f"   Stdout: {result.stdout.strip()}")
            print(f"   Stderr: {result.stderr.strip()}")
        else:
            print("❌ FAIL: Result object missing required attributes")
            return False
        
        # Test 2: Invalid command
        print("\nTest 2: Invalid command with capture_output=True")
        result = shell_runner.run_command("nonexistent_command_12345", capture_output=True)
        
        if result is None:
            print("❌ FAIL: ShellRunner returned None for invalid command")
            return False
        elif hasattr(result, 'returncode') and hasattr(result, 'stdout') and hasattr(result, 'stderr'):
            print(f"✅ PASS: Invalid command returned proper result object")
            print(f"   Return code: {result.returncode}")
            print(f"   Stdout: {result.stdout.strip()}")
            print(f"   Stderr: {result.stderr.strip()}")
        else:
            print("❌ FAIL: Result object missing required attributes")
            return False
        
        # Test 3: Timeout scenario (simulate with very short timeout)
        print("\nTest 3: Timeout scenario with capture_output=True")
        result = shell_runner.run_command("sleep 10", capture_output=True, timeout=1)
        
        if result is None:
            print("❌ FAIL: ShellRunner returned None for timeout scenario")
            return False
        elif hasattr(result, 'returncode') and hasattr(result, 'stdout') and hasattr(result, 'stderr'):
            print(f"✅ PASS: Timeout scenario returned proper result object")
            print(f"   Return code: {result.returncode}")
            print(f"   Stdout: {result.stdout.strip()}")
            print(f"   Stderr: {result.stderr.strip()}")
            print(f"   Error message: {getattr(result, 'error_message', 'None')}")
        else:
            print("❌ FAIL: Result object missing required attributes")
            return False
        
        print("\n✅ ALL SHELL RUNNER TESTS PASSED")
        return True
        
    except Exception as e:
        print(f"❌ SHELL RUNNER TEST FAILED: {e}")
        traceback.print_exc()
        return False

def test_cloudflare_manager_error_handling():
    """Test that CloudflareManager handles shell runner results properly."""
    print("\n" + "=" * 60)
    print("TESTING: CloudflareManager error handling")
    print("=" * 60)
    
    try:
        from tunneling.cloudflare_manager import CloudflareManager
        
        # Create CloudflareManager instance
        cf_manager = CloudflareManager()
        
        print("✅ CloudflareManager imported successfully")
        
        # Test cloudflared status check
        print("\nTest: CloudflareManager status check")
        status = cf_manager.get_cloudflared_status()
        
        if isinstance(status, dict) and 'available' in status:
            print(f"✅ PASS: Status check returned proper dictionary")
            print(f"   Available: {status['available']}")
            print(f"   Version: {status.get('version', 'N/A')}")
            if 'error' in status:
                print(f"   Error: {status['error']}")
        else:
            print("❌ FAIL: Status check did not return proper dictionary")
            return False
        
        print("\n✅ CLOUDFLARE MANAGER TEST PASSED")
        return True
        
    except Exception as e:
        print(f"❌ CLOUDFLARE MANAGER TEST FAILED: {e}")
        traceback.print_exc()
        return False

def test_platform_optimizers():
    """Test that platform optimizers handle shell runner results properly."""
    print("\n" + "=" * 60)
    print("TESTING: Platform optimizers error handling")
    print("=" * 60)
    
    try:
        # Test Colab optimizer
        from platforms.colab_optimizer import ColabOptimizer
        
        colab_optimizer = ColabOptimizer()
        print("✅ ColabOptimizer imported successfully")
        
        gpu_info = colab_optimizer.detect_gpu()
        if isinstance(gpu_info, dict) and 'gpu_available' in gpu_info:
            print(f"✅ PASS: ColabOptimizer GPU detection returned proper dictionary")
            print(f"   GPU available: {gpu_info['gpu_available']}")
            if 'error' in gpu_info:
                print(f"   Error: {gpu_info['error']}")
        else:
            print("❌ FAIL: ColabOptimizer GPU detection did not return proper dictionary")
            return False
        
        # Test Vast optimizer
        from platforms.vast_optimizer import VastOptimizer
        
        vast_optimizer = VastOptimizer()
        print("✅ VastOptimizer imported successfully")
        
        gpu_info = vast_optimizer.detect_vast_gpu()
        if isinstance(gpu_info, dict) and 'gpu_count' in gpu_info:
            print(f"✅ PASS: VastOptimizer GPU detection returned proper dictionary")
            print(f"   GPU count: {gpu_info['gpu_count']}")
        else:
            print("❌ FAIL: VastOptimizer GPU detection did not return proper dictionary")
            return False
        
        # Test Lightning optimizer
        from platforms.lightning_optimizer import LightningOptimizer
        
        lightning_optimizer = LightningOptimizer()
        print("✅ LightningOptimizer imported successfully")
        
        gpu_info = lightning_optimizer.detect_lightning_gpu()
        if isinstance(gpu_info, dict) and 'gpu_type' in gpu_info:
            print(f"✅ PASS: LightningOptimizer GPU detection returned proper dictionary")
            print(f"   GPU type: {gpu_info['gpu_type']}")
        else:
            print("❌ FAIL: LightningOptimizer GPU detection did not return proper dictionary")
            return False
        
        print("\n✅ ALL PLATFORM OPTIMIZER TESTS PASSED")
        return True
        
    except Exception as e:
        print(f"❌ PLATFORM OPTIMIZER TEST FAILED: {e}")
        traceback.print_exc()
        return False

def test_error_recovery():
    """Test that error recovery handles shell runner results properly."""
    print("\n" + "=" * 60)
    print("TESTING: Error recovery system")
    print("=" * 60)
    
    try:
        from optimization.error_recovery import ErrorRecovery
        
        # Create ErrorRecovery instance
        error_recovery = ErrorRecovery()
        
        print("✅ ErrorRecovery imported successfully")
        
        # Test shell command execution
        print("\nTest: Shell command execution")
        result = error_recovery.execute_recovery_action("shell:echo 'test'")
        
        if isinstance(result, bool):
            print(f"✅ PASS: Shell command execution returned boolean")
            print(f"   Result: {result}")
        else:
            print("❌ FAIL: Shell command execution did not return boolean")
            return False
        
        print("\n✅ ERROR RECOVERY TEST PASSED")
        return True
        
    except Exception as e:
        print(f"❌ ERROR RECOVERY TEST FAILED: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all tests to verify silent failures have been fixed."""
    print("🧪 TESTING SD-PINNOKIO SILENT FAILURE FIXES")
    print("=" * 80)
    
    tests = [
        test_shell_runner_capture_output,
        test_cloudflare_manager_error_handling,
        test_platform_optimizers,
        test_error_recovery
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ TEST EXCEPTION: {e}")
            failed += 1
    
    print("\n" + "=" * 80)
    print("🏁 TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Success rate: {passed/(passed+failed)*100:.1f}%")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Silent failures have been fixed.")
        return True
    else:
        print(f"\n⚠️  {failed} tests failed. Some issues may still exist.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)