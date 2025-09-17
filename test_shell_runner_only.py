#!/usr/bin/env python3
"""
Simple test script to verify that ShellRunner handles capture_output=True properly.
"""

import sys
import os
import traceback
from pathlib import Path

# Add the github_repo path to sys.path
github_repo_path = Path(__file__).parent / "github_repo"
sys.path.insert(0, str(github_repo_path))

def test_shell_runner_basic():
    """Test basic ShellRunner functionality."""
    print("=" * 60)
    print("TESTING: ShellRunner basic functionality")
    print("=" * 60)
    
    try:
        from environment_management.shell_runner import ShellRunner, CommandResult
        
        print("✅ ShellRunner imported successfully")
        
        # Create ShellRunner instance with current directory as base path
        current_dir = str(Path(__file__).parent)
        shell_runner = ShellRunner(base_path=current_dir)
        
        print(f"✅ ShellRunner created with base path: {current_dir}")
        
        # Test 1: Valid command with capture_output=True
        print("\nTest 1: Valid command with capture_output=True")
        result = shell_runner.run_command("echo 'Hello World'", capture_output=True)
        
        if result is None:
            print("❌ FAIL: ShellRunner returned None for valid command")
            return False
        elif not isinstance(result, CommandResult):
            print(f"❌ FAIL: Expected CommandResult, got {type(result)}")
            return False
        elif hasattr(result, 'returncode') and hasattr(result, 'stdout') and hasattr(result, 'stderr'):
            print(f"✅ PASS: Valid command returned proper CommandResult object")
            print(f"   Return code: {result.returncode}")
            print(f"   Stdout: {repr(result.stdout)}")
            print(f"   Stderr: {repr(result.stderr)}")
            print(f"   Status: {result.status}")
            print(f"   Command: {result.command}")
        else:
            print("❌ FAIL: CommandResult object missing required attributes")
            return False
        
        # Test 2: Invalid command with capture_output=True
        print("\nTest 2: Invalid command with capture_output=True")
        result = shell_runner.run_command("nonexistent_command_12345", capture_output=True)
        
        if result is None:
            print("❌ FAIL: ShellRunner returned None for invalid command")
            return False
        elif not isinstance(result, CommandResult):
            print(f"❌ FAIL: Expected CommandResult, got {type(result)}")
            return False
        elif hasattr(result, 'returncode') and hasattr(result, 'stdout') and hasattr(result, 'stderr'):
            print(f"✅ PASS: Invalid command returned proper CommandResult object")
            print(f"   Return code: {result.returncode}")
            print(f"   Stdout: {repr(result.stdout)}")
            print(f"   Stderr: {repr(result.stderr)}")
            print(f"   Status: {result.status}")
            print(f"   Error message: {getattr(result, 'error_message', 'None')}")
        else:
            print("❌ FAIL: CommandResult object missing required attributes")
            return False
        
        # Test 3: Timeout scenario with capture_output=True
        print("\nTest 3: Timeout scenario with capture_output=True")
        result = shell_runner.run_command("sleep 5", capture_output=True, timeout=1)
        
        if result is None:
            print("❌ FAIL: ShellRunner returned None for timeout scenario")
            return False
        elif not isinstance(result, CommandResult):
            print(f"❌ FAIL: Expected CommandResult, got {type(result)}")
            return False
        elif hasattr(result, 'returncode') and hasattr(result, 'stdout') and hasattr(result, 'stderr'):
            print(f"✅ PASS: Timeout scenario returned proper CommandResult object")
            print(f"   Return code: {result.returncode}")
            print(f"   Stdout: {repr(result.stdout)}")
            print(f"   Stderr: {repr(result.stderr)}")
            print(f"   Status: {result.status}")
            print(f"   Error message: {getattr(result, 'error_message', 'None')}")
        else:
            print("❌ FAIL: CommandResult object missing required attributes")
            return False
        
        # Test 4: Valid command with capture_output=False
        print("\nTest 4: Valid command with capture_output=False")
        command_id = shell_runner.run_command("echo 'test'", capture_output=False)
        
        if isinstance(command_id, str):
            print(f"✅ PASS: capture_output=False returned command ID: {command_id}")
        else:
            print(f"❌ FAIL: Expected string command ID, got {type(command_id)}")
            return False
        
        print("\n✅ ALL SHELL RUNNER TESTS PASSED")
        return True
        
    except Exception as e:
        print(f"❌ SHELL RUNNER TEST FAILED: {e}")
        traceback.print_exc()
        return False

def test_command_result_compatibility():
    """Test that CommandResult has the expected compatibility attributes."""
    print("\n" + "=" * 60)
    print("TESTING: CommandResult compatibility")
    print("=" * 60)
    
    try:
        from environment_management.shell_runner import CommandResult, CommandStatus
        
        # Create a CommandResult instance
        result = CommandResult(
            command_id="test_cmd",
            command="echo test",
            status=CommandStatus.COMPLETED,
            return_code=0,
            stdout="test output",
            stderr="",
            start_time=1234567890,
            end_time=1234567891,
            duration=1.0
        )
        
        print("✅ CommandResult created successfully")
        
        # Test compatibility attributes
        required_attrs = ['command_id', 'command', 'status', 'return_code', 'stdout', 'stderr', 
                          'start_time', 'end_time', 'duration', 'returncode']
        
        missing_attrs = []
        for attr in required_attrs:
            if not hasattr(result, attr):
                missing_attrs.append(attr)
        
        if missing_attrs:
            print(f"❌ FAIL: Missing attributes: {missing_attrs}")
            return False
        
        # Test that returncode is an alias for return_code
        if result.returncode != result.return_code:
            print(f"❌ FAIL: returncode ({result.returncode}) != return_code ({result.return_code})")
            return False
        
        print(f"✅ PASS: All required attributes present")
        print(f"   return_code: {result.return_code}")
        print(f"   returncode: {result.returncode}")
        print(f"   stdout: {repr(result.stdout)}")
        print(f"   stderr: {repr(result.stderr)}")
        print(f"   status: {result.status}")
        
        print("\n✅ COMMAND RESULT COMPATIBILITY TEST PASSED")
        return True
        
    except Exception as e:
        print(f"❌ COMMAND RESULT COMPATIBILITY TEST FAILED: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all tests."""
    print("🧪 TESTING SD-PINNOKIO SHELL RUNNER FIXES")
    print("=" * 80)
    
    tests = [
        test_shell_runner_basic,
        test_command_result_compatibility
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
            traceback.print_exc()
            failed += 1
    
    print("\n" + "=" * 80)
    print("🏁 TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Success rate: {passed/(passed+failed)*100:.1f}%")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! ShellRunner silent failures have been fixed.")
        return True
    else:
        print(f"\n⚠️  {failed} tests failed. Some issues may still exist.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)